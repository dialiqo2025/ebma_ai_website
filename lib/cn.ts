export function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const container =
  "mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)]";
