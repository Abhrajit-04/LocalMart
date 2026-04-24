import axios from 'axios'

async function emitEventHandler(
  event: string,
  data: any,
  socketId?: string
) {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_SERVER}/emit`, // ✅ FIXED
      { socketId, event, data }
    )
  } catch (error) {
    console.log(error)
  }
}

export default emitEventHandler