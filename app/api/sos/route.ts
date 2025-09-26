import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER!;
const sosNumber = process.env.NEXT_PUBLIC_SOS_NUMBER ?? "+18005550199";

const client = twilio(accountSid, authToken);

export async function POST() {
  try {
    console.log("📞 Initiating SOS call...");
    console.log("➡️ From:", twilioNumber, "To:", sosNumber);

    const call = await client.calls.create({
      to: sosNumber,            // Your Indian number (+91 format)
      from: twilioNumber,       // Your Twilio US number
      url: "http://demo.twilio.com/docs/voice.xml", // Twilio will speak this
    });

    console.log("✅ Call started with SID:", call.sid);

    return NextResponse.json({ success: true, callSid: call.sid });
  } catch (err: any) {
    console.error("❌ Twilio Call Error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
