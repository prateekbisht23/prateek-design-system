import type * as React from 'react';

export interface NavLink { label: string; href: string; active?: boolean }
export interface HeaderProps { name?: string; homeHref?: string; links?: NavLink[]; className?: string }
/** Name on the left, three or four plain-text nav links on the right, one hairline below. */
export declare function Header(props: HeaderProps): React.ReactElement;

export interface StatusProps { label?: string; live?: boolean; children?: React.ReactNode; className?: string }
/** "Now · …" line with the marigold dot. One per page. */
export declare function Status(props: StatusProps): React.ReactElement;

export interface LocalTimeProps { timeZone?: string; place?: string; zoneLabel?: string; className?: string }
/** Live local time in mono, e.g. "Delhi · 14:32 IST". */
export declare function LocalTime(props: LocalTimeProps): React.ReactElement;

export interface TextLinkProps { href: string; external?: boolean; children?: React.ReactNode; className?: string }
/** Inline link: ink text, line-strong underline; external links get a ↗. */
export declare function TextLink(props: TextLinkProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'solid' | 'ghost' | 'text'; href?: string }
/** Solid (once per view), ghost (default) or text. Renders an <a> when given href. */
export declare function Button(props: ButtonProps): React.ReactElement;

export interface CopyButtonProps { value: string; label?: string; copiedLabel?: string; variant?: 'solid' | 'ghost' | 'text'; showValue?: boolean }
/** Copies a value (your email) and confirms with "Copied" for two seconds. */
export declare function CopyButton(props: CopyButtonProps): React.ReactElement;

export interface SectionProps { label: string; id?: string; children?: React.ReactNode; className?: string }
/** A label column beside its content (stacked under 640px). */
export declare function Section(props: SectionProps): React.ReactElement;

export interface WorkItem { title: string; year: string | number; href?: string; note?: string }
export interface WorkListProps { items: WorkItem[]; className?: string }
/** Hairline rows: title left, mono year right; hovering one dims the rest. */
export declare function WorkList(props: WorkListProps): React.ReactElement;

export interface LinkItem { label: string; href: string; meta?: string; external?: boolean }
export interface LinkListProps { items: LinkItem[]; className?: string }
/** A vertical list of outbound links (Resume, GitHub, LinkedIn…). */
export declare function LinkList(props: LinkListProps): React.ReactElement;

export interface TagProps { items?: string[]; children?: React.ReactNode; className?: string }
/** Mono outline tag for stack items; pass items for a wrapped row. */
export declare function Tag(props: TagProps): React.ReactElement;

declare global {
  interface Window {
    Prateek: { Header: typeof Header; Status: typeof Status; LocalTime: typeof LocalTime; TextLink: typeof TextLink; Button: typeof Button; CopyButton: typeof CopyButton; Section: typeof Section; WorkList: typeof WorkList; LinkList: typeof LinkList; Tag: typeof Tag };
  }
}

declare const Prateek: Window['Prateek'];
export default Prateek;
