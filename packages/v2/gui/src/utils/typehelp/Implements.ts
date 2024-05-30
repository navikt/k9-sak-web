/**
 * Implements er ein utility type som kan brukast viss ein vil sikre at ein type T implementerer type I fullstendig.
 *
 * Det vil seie at ein sikrer at type T minst har samme props som I definert.
 */
export type Implements<I, T extends I> = T;
