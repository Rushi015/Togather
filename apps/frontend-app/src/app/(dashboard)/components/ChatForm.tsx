import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/useGameStore";

const avatars = ["adam", "ash", "lucy", "nancy" ];

const joinSpaceSchema = z.object({
  roomName: z.string().min(1, "Room name is required"),
  name: z.string().min(1, "Your name is required"),
  avatar: z.string().min(1, "Avatar is required"),
});

type JoinSpaceData = z.infer<typeof joinSpaceSchema>;

const ChatForm = () => {
  const router = useRouter();
  const setUserInfo = useGameStore((state) => state.setUserInfo);
  const form = useForm<JoinSpaceData>({
    resolver: zodResolver(joinSpaceSchema),
    defaultValues: {
      roomName: "",
      name: "",
      avatar: avatars[0],
    },
  });

   const handleSubmit = (data: JoinSpaceData) => {
    setUserInfo({
      username: data.name,
      avatar: data.avatar,
      room: data.roomName,
    });
    router.push("/spaces");
  };
  return (
    <Wrapper>
      <Container>
        <div className="m-7 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 max-w-md mx-auto"
            >
              <FormField
                control={form.control}
                name="roomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter space/room name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Avatar Selection */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Avatar</FormLabel>
                    <FormControl>
                      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                        {avatars.map((src, index) => (
                          <img
                            key={index}
                            src={`/assets/Avatars/${src}.png`} // dynamic image path
                            alt={`Avatar ${index + 1}`}
                            onClick={() => field.onChange(src)} // src is "adam" or "ash"
                            className={`w-30 h-30 rounded-lg cursor-pointer border-4 transition-all duration-300 ${
                              field.value === src
                                ? "border-blue-500 scale-110"
                                : "border-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Space
              </Button>
            </form>
          </Form>
        </div>
      </Container>
    </Wrapper>
  );
};

export default ChatForm;
