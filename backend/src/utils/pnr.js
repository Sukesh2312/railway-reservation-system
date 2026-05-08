import { customAlphabet } from "nanoid";
const digits = customAlphabet("0123456789", 10);
export const generatePNR = () => digits();
