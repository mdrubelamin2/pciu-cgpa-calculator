import { fetcher } from "@/utils/helpers";
import { urls } from "@/utils/urls";
import { NextResponse } from "next/server";

export const GET = async (_, { params }) => {
    const { id } = params;
    const url = `${urls.STUDENT_INFO_API}/get?studentIdNo=${id}`
    const data = await fetcher(url);
    if (data.length === 0) return new NextResponse(JSON.stringify({}));
    return new NextResponse(JSON.stringify(data[0]));
}