import { createDidStudio, CreateDidResponse } from "./cheqdStudio";

export async function createDid(): Promise<CreateDidResponse> {
  return createDidStudio();
}