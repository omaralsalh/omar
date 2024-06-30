import type * as Party from "partykit/server";

import { Rooms } from "./types";

export default class roomserver implements Party.Server {
  // Track room occupancy

  // Track room occupancy
  rooms: Rooms;

  constructor(public room: Party.Room) {
    this.rooms = {};
  }

  onConnect(connection: Party.Connection) {
    connection.send(JSON.stringify({ type: "rooms", rooms: this.rooms }));
  }

  async onRequest(req: Party.Request) {
    if (req.method === "GET") {
      return new Response(
        `Hi! This is party '${this.room.name}' and room '${this.room.id}'!`,
      );
    }

    if (req.method === "POST") {
      const { room, count }: { room: string; count: number } = await req.json();

      this.rooms[room] = count;
      this.room.broadcast(JSON.stringify({ type: "rooms", rooms: this.rooms }));

      return Response.json({ ok: true });
    }

    // Always return a Response
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
}

roomserver satisfies Party.Worker;
