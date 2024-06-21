import connectToDB from "@/lib/db"
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"

const ObjectId = require("mongoose").Types.ObjectId;

// GET
export const GET = async () => {
    try {
        await connectToDB();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 })
    } catch (error) {
        return new NextResponse("Error in fetching user" + error , { status: 500 })
    }
}

// POST
export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connectToDB();
        const newUser = new User(body);
        await newUser.save();

        return new NextResponse(JSON.stringify({ message: "User created", user: newUser }), { status: 200 })
    } catch (error) {
        return new NextResponse("Error in creating user" + error, { status: 500 })
    }
}

// PATCH
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;
        await connectToDB();

        if (!userId || !newUsername) {
            return new NextResponse(JSON.stringify({ message: "ID or username not found"}), { status: 404 });
        };

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid User id"}), { status: 400 });
        };

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId)},
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database"}), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: "User updated", user: updatedUser }), { status: 200 });

    } catch (error) {
        return new NextResponse("Error in updating user" + error, { status: 500 })
    }
};

// DELETE
export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(JSON.stringify({ message: "ID not found"}), { status: 404 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user id"}), { status: 400 });
        }

        await connectToDB();

        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if (!deletedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found in database" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: "User deleted successfully", user: deletedUser }), { status: 200})
    } catch (error) {
        return new NextResponse("Error in deleting user" + error, { status: 500 })
    }
}