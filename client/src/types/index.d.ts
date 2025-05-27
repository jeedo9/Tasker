import type { PropsWithChildren } from "react";

export type RemoveChildren<T extends PropsWithChildren> = Omit<T, 'children'>