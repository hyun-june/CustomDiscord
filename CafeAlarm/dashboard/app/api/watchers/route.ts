import { connectMongoDB } from "@/lib/mongodb";
import {
  encryptWebhookUrl,
  WebhookEncryptionConfigError,
} from "@/lib/webhookCrypto";
import { WatcherModel } from "@/models/Watcher";
import { NextResponse } from "next/server";

type WatcherResponseSource = {
  _id: { toString(): string };
  name: string;
  naverCafeUrl: string;
  pollIntervalSeconds: number;
  enabled: boolean;
  status: "healthy" | "error" | "paused";
  lastCheckedAt: Date | null;
  lastError: string | null;
  discordWebhookMasked?: string;
};

const toWatcherResponse = (watcher: WatcherResponseSource) => ({
  _id: watcher._id.toString(),
  name: watcher.name,
  naverCafeUrl: watcher.naverCafeUrl,
  pollIntervalSeconds: watcher.pollIntervalSeconds,
  enabled: watcher.enabled,
  status: watcher.status,
  lastCheckedAt: watcher.lastCheckedAt,
  lastError: watcher.lastError,
  discordWebhookConfigured: Boolean(watcher.discordWebhookMasked),
  discordWebhookMasked:
    watcher.discordWebhookMasked ?? "기존 웹훅을 다시 등록해주세요.",
});

export async function GET() {
  try {
    await connectMongoDB();

    const watchers = await WatcherModel.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(watchers.map(toWatcherResponse));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "감시 대상 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectMongoDB();

    const body = await request.json();

    if (
      typeof body.name !== "string" ||
      typeof body.naverCafeUrl !== "string" ||
      typeof body.discordWebhookUrl !== "string" ||
      typeof body.pollIntervalSeconds !== "number" ||
      !body.name.trim() ||
      !body.naverCafeUrl.trim() ||
      !body.discordWebhookUrl.trim() ||
      !Number.isFinite(body.pollIntervalSeconds) ||
      body.pollIntervalSeconds < 60
    ) {
      return NextResponse.json(
        { message: "올바른 감시 대상 정보를 입력해주세요." },
        { status: 400 },
      );
    }
    const encryptedWebhook = encryptWebhookUrl(body.discordWebhookUrl.trim());

    const watcher = await WatcherModel.create({
      name: body.name.trim(),
      naverCafeUrl: body.naverCafeUrl.trim(),
      discordWebhookCiphertext: encryptedWebhook.ciphertext,
      discordWebhookIv: encryptedWebhook.iv,
      discordWebhookAuthTag: encryptedWebhook.authTag,
      discordWebhookMasked: encryptedWebhook.maskedUrl,
      pollIntervalSeconds: body.pollIntervalSeconds,
    });
    return NextResponse.json(toWatcherResponse(watcher), {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof WebhookEncryptionConfigError) {
      return NextResponse.json(
        { message: "서버의 웹훅 암호화 키 설정이 올바르지 않습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "감시 대상 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
