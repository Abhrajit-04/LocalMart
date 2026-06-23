
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        
        const {message,role}=await req.json()
        const text = message?.toLowerCase() || ""

const has = (...words: string[]) =>
  words.some(word => text.includes(word))

if (has("prepared","ready","preparing","packing","cooking")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Preparing now 👍",
          "Almost ready 😊",
          "Will update shortly 🚚"
        ]
      : [
          "Is it ready now?",
          "Any update please?",
          "How much longer?"
        ],
    { status: 200 }
  )
}
if (has("time","eta","minutes","when","how long")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Around 10 minutes 👍",
          "Reaching shortly 🚴",
          "Almost there 😊"
        ]
      : [
          "How much longer?",
          "What's the ETA?",
          "Are you nearby?"
        ],
    { status: 200 }
  )
}
if (has("where","location","near","map")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "I'm nearby 📍",
          "Sharing location now",
          "Reaching soon 🚴"
        ]
      : [
          "Where are you now?",
          "Can you share location?",
          "How far away are you?"
        ],
    { status: 200 }
  )
}
if (has("call","phone","ring")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Calling you now 📞",
          "Please answer the call",
          "Contacting shortly"
        ]
      : [
          "Please call me",
          "I'm unable to hear you",
          "Can we talk briefly?"
        ],
    { status: 200 }
  )
}
if (has("late","delay","delayed","traffic")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Slight delay ahead",
          "Reaching shortly 👍",
          "Sorry for the delay"
        ]
      : [
          "Any delay today?",
          "How much longer?",
          "Please update me"
        ],
    { status: 200 }
  )
}
if (has("address","house","building","flat","apartment")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Please share exact address",
          "Need landmark please",
          "Unable to locate address"
        ]
      : [
          "Sharing address now",
          "Near main gate",
          "I'll send location"
        ],
    { status: 200 }
  )
}
if (has("otp","verification","code")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Please share OTP",
          "Need verification code",
          "Kindly provide OTP"
        ]
      : [
          "Sending OTP now",
          "Please wait",
          "Checking message"
        ],
    { status: 200 }
  )
}
if (has("payment","upi","cash","paid","money")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Payment received 👍",
          "You can pay online",
          "Cash is accepted"
        ]
      : [
          "Payment completed",
          "Can I pay online?",
          "Is cash accepted?"
        ],
    { status: 200 }
  )
}
if (has("arrived","reach","outside","gate")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "I've arrived 📍",
          "I'm outside now",
          "Please come outside"
        ]
      : [
          "Coming outside now",
          "Please wait a minute",
          "I'm at the gate"
        ],
    { status: 200 }
  )
}
if (has("thank","thanks","thank you")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Happy to help 😊",
          "Thank you for ordering ❤️",
          "Have a great day"
        ]
      : [
          "Thank you 😊",
          "Appreciate it ❤️",
          "Have a nice day"
        ],
    { status: 200 }
  )
}
if (has("kaha ho", "kaha hai", "kidhar ho")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Main paas hi hu 🚴",
          "Location share kar raha hu 📍",
          "Bas pahuchne wala hu"
        ]
      : [
          "Bhai kaha tak pahunche?",
          "Location share kijiye",
          "Kitni door ho?"
        ],
    { status: 200 }
  )
}
if (has("kitni der", "kab tak", "kitna time")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "10 minute aur lagenge",
          "Bas pahuch raha hu",
          "Reaching shortly 👍"
        ]
      : [
          "Kitni der aur?",
          "ETA kya hai?",
          "Please update"
        ],
    { status: 200 }
  )
}
if (has("call karo", "phone karo")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Abhi call karta hu 📞",
          "Ek minute please",
          "Calling now"
        ]
      : [
          "Please call me",
          "Phone kar dijiye",
          "Need a quick call"
        ],
    { status: 200 }
  )
}
if (has("jaldi", "jaldi aao", "fast")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Jaldi pahuch raha hu 🚴",
          "Bas 5 minute",
          "On the way 👍"
        ]
      : [
          "Please jaldi aaiye",
          "Waiting outside",
          "Come soon please"
        ],
    { status: 200 }
  )
}
if (has("gate pe", "main gate", "bahar hu")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Main gate ke paas hu",
          "Please bahar aa jaiye",
          "I've arrived 📍"
        ]
      : [
          "Coming outside",
          "Gate par aa raha hu",
          "One minute please"
        ],
    { status: 200 }
  )
}
if (has("address bhej", "location bhej", "address send")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Address mil gaya 👍",
          "Checking location",
          "Reaching there soon"
        ]
      : [
          "Location bhej raha hu",
          "Address share kar diya",
          "Please check map"
        ],
    { status: 200 }
  )
}
if (has("ruko", "wait karo", "ruk jaiye")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Okay, waiting 👍",
          "No problem",
          "Take your time"
        ]
      : [
          "Please wait 2 minutes",
          "Coming shortly",
          "Don't leave please"
        ],
    { status: 200 }
  )
}
if (has("nahi mil raha", "find nahi", "locate nahi")) {
  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "Landmark bata dijiye",
          "Location confirm kariye",
          "Unable to locate address"
        ]
      : [
          "Near temple",
          "Near main road",
          "Sharing live location"
        ],
    { status: 200 }
  )
}
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
        const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,{
            method:"POST",
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
       if (!response.ok) {
  console.log("Gemini HTTP Error:", response.status)

  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "I'm on the way 🚴",
          "Reaching shortly 👍",
          "Please keep phone nearby 📞",
        ]
      : [
          "How long will it take?",
          "I'm waiting at home 🏠",
          "Please call when nearby 📱",
        ],
    { status: 200 }
  )
}

        const data = await response.json()

if (data.error) {
  console.log("GEMINI ERROR:", data.error)

  return NextResponse.json(
    role === "delivery_boy"
      ? [
          "I'm on the way 🚴",
          "Reaching shortly 👍",
          "Please keep your phone nearby 📞",
        ]
      : [
          "How long will it take?",
          "I'm waiting at home 🏠",
          "Please call when nearby 📱",
        ],
    { status: 200 }
  )
}
        const replyText =
  data.candidates?.[0]?.content?.parts?.[0]?.text || ""


        const suggestions = [...new Set(
  replyText
    .replace(/\r/g, "")
    .split(/\n|,/)
    .map((s: string) =>
      s.replace(/^[-•*\d.]\s*/, "").trim()
    )
    .filter(Boolean)
)]
.slice(0, 3)


        return NextResponse.json(
            suggestions,{status:200}
        )
    } catch (error) {
  console.log(error)

  return NextResponse.json(
    [
      "Please wait a moment",
      "Try again shortly",
      "Network issue detected"
    ],
    { status: 200 }
  )
}
}