import axios from "axios";

const userToken = `Bearer ${localStorage.getItem("token")}`;

export interface EventInput {
  title: string
  groupId: string
  start: string
  end: string
  description?: string
}

export async function createEvent(event: EventInput) {

  const config = {
      headers: { Authorization: userToken }
  };

  const body = event
    try {
        await axios.post("/api/events", body, config);

    } catch (error) {
        throw new Error(`Couldn't create event. Error: ${error}`);
    }

}
