import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-[11px] min-h-[42px] px-[18px] text-[13px] font-bold cursor-pointer transition duration-[250ms] whitespace-nowrap hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:translate-y-0";

const variants = {
  primary:
    "border-0 text-white bg-brand-gradient shadow-[0_9px_28px_rgba(101,66,232,.25),inset_0_1px_rgba(255,255,255,.15)] hover:shadow-[0_12px_34px_rgba(101,66,232,.4),inset_0_1px_rgba(255,255,255,.2)]",
  outline: "border border-border bg-surface text-text shadow-[0_1px_2px_rgba(18,21,40,.04)]",
  ghost: "border border-border bg-transparent text-text",
  quiet: "border border-black/8 bg-black/[0.03] text-[#1d1b2e]",
  light: "border-0 bg-white text-[#4d32c8]",
  glass: "border border-white/35 bg-white/15 text-white",
} as const;

type Variant = keyof typeof variants;

type ButtonProps = {
  variant?: Variant;
  large?: boolean;
  className?: string;
  children: ReactNode;
} & (
  | ({ href: string } & Omit<ComponentProps<"a">, "className" | "children" | "href">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

export function Button({
  variant = "primary",
  large,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cx(
    base,
    variants[variant],
    large && "min-h-[52px] px-6 rounded-[14px] text-sm",
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props;
    if (isExternalHref(href)) {
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ComponentProps<"button">;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
