import type { NoteHelper } from "./index";

export const note: NoteHelper;
export const Notify: {
    create(payload: Record<string, unknown>): unknown;
    setDefaults(payload: Record<string, unknown>): unknown;
};
export function configureNote(
    nextAdapters?: Record<string, unknown>,
): NoteHelper;