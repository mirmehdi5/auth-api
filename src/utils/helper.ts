import ms, { StringValue } from "ms";

export const parseDuration = (duration: StringValue): number => {
    return ms(duration);
}