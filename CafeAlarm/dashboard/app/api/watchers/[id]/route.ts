import { connectMongoDB } from "@/lib/mongodb";
import { WatcherModel } from "@/models/Watcher";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

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

    const deletedWatcher = await WatcherModel.findByIdAndDelete(id);

    if (!deletedWatcher) {
      return NextResponse.json(
        { message: "감시 대상을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "감시 대상 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
