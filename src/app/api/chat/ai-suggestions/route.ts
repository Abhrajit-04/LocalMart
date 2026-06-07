import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {message,role}=await req.json()
        const prompt=`You are a profesional delivery assistant chatbot.
        
You will be given:
- role: either "user" or "delivery_boy" 
- last message: the last message sent in the conversation

Your task:
👉 If role is "user" → genetrate 3 short WhatsApp-style reply suggestion that a user could send to the delivery boy.
👉 If role is "delivery_boy"  → generate 3 WhatsApp-style reply suggestion that a delivery boy could send to the user.

⚠️ Follow these rules:
- Replies must match the context of the last message.
-Keep replies short, human-like (max 10 words).
-Use emojis naturally (max one per reply).
-No generic replies like "Okay" or "Thank You".
-Must be helpful, respectful, and relevant to delivery, status, help, or location.
-No numbering, No extra instructions, No extra text.
-Just return coma-separated reply suggestion.

Return only the three reply suggestions,coma-separated.

Role:${role}
Last message:${message}`
        const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,{
            method:"POSt",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "contents":[
                    {
                        "parts":[
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            })
        })

        const data=await response.json()
        const replyText=data.candidates?.[0].content.parts?.[0].text || ""
        const suggestions=replyText.split(",").map((s:String)=>s.trim())
        return NextResponse.json(
            suggestions,{status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`gemini error ${error}`},{status:200}
        )
    }
}