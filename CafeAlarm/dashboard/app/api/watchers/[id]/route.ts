import { connectMongoDB } from "@/lib/mongodb";
import { SeenArticleModel } from "@/models/SeenArticle";
import { WatcherModel } from "@/models/Watcher";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const toWatcherResponse = (watcher: {
  _id: { toString(): string };
  name: string;
  naverCafeUrl: string;
  pollIntervalSeconds: number;
  enabled: boolean;
  status: "healthy" | "error" | "paused";
  lastCheckedAt: Date | null;
  lastError: string | null;
  discordWebhookMasked?: string;
}) => ({
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!mongoose.isValidObjectId(id) || typeof body.enabled !== "boolean") {
      return NextResponse.json(
        { message: "올바르지 않은 감시 대상 요청입니다." },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const existingWatcher = await WatcherModel.findById(id);

    if (!existingWatcher) {
      return NextResponse.json(
        { message: "감시 대상을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (body.enabled) {
      await SeenArticleModel.deleteMany({ watcherId: id });
    }

    const watcher = await WatcherModel.findByIdAndUpdate(
      id,
      {
        enabled: body.enabled,
        status: "paused",
        lastError: null,
        ...(body.enabled ? { lastCheckedAt: null } : {}),
      },
      { new: true },
    );

    return NextResponse.json(toWatcherResponse(watcher!));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "감시 대상 상태 변경에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "올바르지 않은 감시 대상 ID입니다." },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const watcher = await WatcherModel.findById(id);

    if (!watcher) {
      return NextResponse.json(
        { message: "감시 대상을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    await SeenArticleModel.deleteMany({ watcherId: id });
    await WatcherModel.findByIdAndDelete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "감시 대상 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
