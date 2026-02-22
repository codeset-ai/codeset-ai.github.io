# General Index

## Root

- `README.md` - Project README with setup, architecture, and deployment instructions [DOCS]
- `components.json` - shadcn UI generator configuration and alias mapping [CONFIG]
- `globals.css` - Global CSS including Tailwind imports and design tokens [CONFIG]
- `next.config.mjs` - Next.js configuration with optional user overrides [CONFIG]
- `package.json` - Project manifest and dependency list for the Next.js app [CONFIG]
- `postcss.config.mjs` - PostCSS configuration enabling Tailwind plugin [CONFIG]
- `tailwind.config.js` - Tailwind CSS configuration and theme extensions [CONFIG]
- `tsconfig.json` - TypeScript compiler options for the project [CONFIG]

## app/

- `globals.css` - Global Tailwind-based styles, theme variables, and dark mode tokens. Key: `--background`, `--radius`, `.text-balance`, `.blog-code-block .hljs` [SOURCE_CODE]
- `landing-layout.tsx` - A small Next.js/React layout component that wraps landing pages with a header and global styles. Key: `LandingLayout` [SOURCE_CODE]
- `layout.tsx` - Root Next.js app layout: global metadata, font, auth provider, analytics and UI plumbing.. Key: `metadata`, `ibmPlexMono`, `RootLayout`, `GoogleAnalytics`, `GA_TRACKING_ID` [SOURCE_CODE]
- `page.tsx` - Next.js client-side homepage component rendering hero UI and an SDK code sample with auth-aware CTAs. Key: `Home`, `sdkCode` [SOURCE_CODE]

## app/auth/callback/

- `page.tsx` - Client-side handler for OAuth callback and redirect. Key: `AuthCallbackContent`, `AuthCallback` [SOURCE_CODE]

## app/blog/

- `page.tsx` - Next.js app directory server component rendering the blog index (list of posts).. Key: `BlogPage`, `posts` [SOURCE_CODE]

## app/blog/[slug]/

- `page.tsx` - Static-rendered blog post page by slug. Key: `generateStaticParams`, `default` [SOURCE_CODE]

## app/contact/

- `page.tsx` - Next.js page that renders the site's contact page by embedding a Google Form with header and footer.. Key: `ContactForm` [SOURCE_CODE]

## app/dashboard/

- `layout.tsx` - Client-side Next.js layout component that enforces auth and renders the dashboard chrome (header, sidebar, content).. Key: `DashboardLayout` [SOURCE_CODE]
- `page.tsx` - Client-side Next.js dashboard page that shows user account, API keys and credit balance.. Key: `Dashboard`, `formatDate`, `formatCurrency` [SOURCE_CODE]

## app/dashboard/api-keys/

- `page.tsx` - Dashboard UI for creating, viewing, and revoking API keys. Key: `default`, `handleCreateKey`, `handleRevokeKey`, `copyToClipboard`, `toggleKeyVisibility` [SOURCE_CODE]

## app/dashboard/credits/

- `page.tsx` - Client-side Credits dashboard page for viewing and adding balance. Key: `CreditsPage`, `loadData`, `handleDeposit`, `handleRefresh`, `formatCurrency` [SOURCE_CODE]

## app/dashboard/usage/

- `page.tsx` - Client-side Usage history and billing summary page. Key: `UsagePage`, `loadUsageData`, `handlePageChange`, `formatDuration` [SOURCE_CODE]

## app/datasets/

- `page.tsx` - React client page that lists datasets and paginated samples with search and a sample details modal.. Key: `DatasetsPage`, `formatDate`, `getLanguageColor`, `handleSampleClick`, `handlePageChange` [SOURCE_CODE]

## app/team/

- `page.tsx` - Next.js React component that renders a static 'Meet Our Team' page with member cards and contact call-to-action.. Key: `Team`, `teamMembers` [SOURCE_CODE]

## blog-posts/

- `building-in-public-origin-of-codeset.md` - Blog post telling the origin story of Codeset [DOCS]
- `introducing-swe-bench.md` - Announcement: SWE-Bench Verified integration on Codeset [DOCS]
- `platform-launch-python-gym.md` - Launch post for Codeset platform and codeset-gym-python dataset [DOCS]
- `welcome-to-codeset.md` - Introductory blog post announcing Codeset [DOCS]

## components/

- `BlogContent.tsx` - React component that renders HTML blog content and replaces <pre><code> blocks with a SyntaxHighlighter UI.. Key: `BlogContent`, `processContent` [SOURCE_CODE]
- `ConveyorBeltAnimation.tsx` - React component that renders an animated conveyor-belt UI of issue items processed by an AI agent, with performance and responsive optimizations.. Key: `ConveyorBeltAnimation`, `updateWidth`, `getRepoIcon`, `getRepoColor` [SOURCE_CODE]
- `Footer.tsx` - A small React/Next.js footer component rendering site links and the current year.. Key: `Footer` [SOURCE_CODE]
- `GoogleAnalytics.tsx` - Client-side Next.js component and helpers for sending Google Analytics (gtag) pageviews and events.. Key: `GA_TRACKING_ID`, `pageview`, `event`, `GoogleAnalytics` [SOURCE_CODE]
- `Header.tsx` - Responsive site header with navigation links and auth-aware sign in / dashboard UI.. Key: `Header`, `mobileMenuOpen`, `setMobileMenuOpen`, `useAuth` [SOURCE_CODE]
- `SampleDetailsModal.tsx` - React modal component to display a Sample's metadata, test lists, code patches and highlighted diffs.. Key: `SampleDetailsModal`, `parseDiff`, `DiffHighlighter`, `CodeHighlighter`, `TestList` [SOURCE_CODE]
- `theme-provider.tsx` - A thin client-side wrapper that exposes next-themes' ThemeProvider for the app.. Key: `ThemeProvider` [SOURCE_CODE]

## components/ui/

- `accordion.tsx` - A small React wrapper around Radix Accordion primitives with Tailwind styling and a chevron icon. Key: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` [SOURCE_CODE]
- `alert-dialog.tsx` - Reusable, styled AlertDialog React components wrapping Radix UI primitives with Tailwind classes.. Key: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent` [SOURCE_CODE]
- `alert.tsx` - Small, accessible Alert UI components with style variants using cva and Tailwind classes. Key: `alertVariants`, `Alert`, `AlertTitle`, `AlertDescription` [SOURCE_CODE]
- `aspect-ratio.tsx` - Thin client-side wrapper that re-exports Radix UI's AspectRatio.Root as AspectRatio.. Key: `AspectRatio` [SOURCE_CODE]
- `avatar.tsx` - Client-side React wrapper around Radix Avatar primitives with project styling helpers.. Key: `Avatar`, `AvatarImage`, `AvatarFallback` [SOURCE_CODE]
- `badge.tsx` - A small React Badge UI component with variant styling powered by class-variance-authority and Tailwind classes.. Key: `badgeVariants`, `BadgeProps`, `Badge` [SOURCE_CODE]
- `breadcrumb.tsx` - Accessible React breadcrumb UI primitives (Breadcrumb, list, items, links, separators, ellipsis).. Key: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage` [SOURCE_CODE]
- `button.tsx` - A reusable, styled Button React component with variant and size props using cva and forwardRef.. Key: `buttonVariants`, `ButtonProps`, `Button` [SOURCE_CODE]
- `calendar.tsx` - A Next.js client React wrapper around react-day-picker that provides Tailwind-styled calendar UI.. Key: `CalendarProps`, `Calendar` [SOURCE_CODE]
- `card.tsx` - A small set of reusable, styled Card components (container + header/title/description/content/footer) for the UI library.. Key: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` [SOURCE_CODE]
- `carousel.tsx` - React Embla-based accessible Carousel wrapper with context and controls. Key: `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext` [SOURCE_CODE]
- `chart.tsx` - A small React wrapper around Recharts that provides theming, shared config, and custom tooltip/legend UI.. Key: `THEMES`, `ChartConfig`, `ChartContext`, `useChart`, `ChartContainer` [SOURCE_CODE]
- `checkbox.tsx` - A styled, accessible Checkbox React component wrapper around Radix UI with an icon indicator.. Key: `Checkbox`, `cn`, `CheckboxPrimitive.Root` [SOURCE_CODE]
- `collapsible.tsx` - Thin client-side re-export of Radix Collapsible primitives for app-wide use. Key: `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` [SOURCE_CODE]
- `command.tsx` - Reusable, styled React wrappers around cmdk primitives to provide a command palette/dialog UI.. Key: `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty` [SOURCE_CODE]
- `context-menu.tsx` - React wrappers around Radix Context Menu primitives with Tailwind-based styling and icons.. Key: `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem` [SOURCE_CODE]
- `dialog.tsx` - A thin, styled wrapper around Radix UI Dialog primitives to provide a consistent modal/dialog API and Tailwind-based styling.. Key: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay` [SOURCE_CODE]
- `drawer.tsx` - A styled wrapper around vaul's Drawer primitives providing a bottom-sheet Drawer UI for the app.. Key: `Drawer`, `DrawerTrigger`, `DrawerPortal`, `DrawerClose`, `DrawerOverlay` [SOURCE_CODE]
- `dropdown-menu.tsx` - A set of styled React wrapper components around Radix UI's dropdown primitives for consistent dropdown menus.. Key: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuPortal`, `DropdownMenuSub` [SOURCE_CODE]
- `form.tsx` - React form primitives that bridge react-hook-form state to UI components with ARIA-friendly labels, descriptions and messages.. Key: `Form`, `FormFieldContext`, `FormField`, `useFormField`, `FormItemContext` [SOURCE_CODE]
- `hover-card.tsx` - Client-side React wrapper around Radix HoverCard with preset styling and API conveniences. Key: `HoverCard`, `HoverCardTrigger`, `HoverCardContent` [SOURCE_CODE]
- `input-otp.tsx` - React wrapper components around a third‑party OTP input library providing styled slots, group and separator.. Key: `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator` [SOURCE_CODE]
- `input.tsx` - Styled input component wrapper using shared utility classes. Key: `Input`, `cn` [SOURCE_CODE]
- `label.tsx` - Accessible form label component using Radix label primitive. Key: `Label`, `labelVariants`, `cn` [SOURCE_CODE]
- `menubar.tsx` - Composable menubar components built on Radix primitives. Key: `Menubar`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem` [SOURCE_CODE]
- `navigation-menu.tsx` - Navigation menu primitives with styled triggers and viewport. Key: `NavigationMenu`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuViewport`, `navigationMenuTriggerStyle` [SOURCE_CODE]
- `pagination.tsx` - Composable pagination components with styled links and controls. Key: `Pagination`, `PaginationContent`, `PaginationLink`, `PaginationPrevious`, `PaginationNext` [SOURCE_CODE]
- `popover.tsx` - Popover wrapper components using Radix popover primitive. Key: `Popover`, `PopoverTrigger`, `PopoverContent` [SOURCE_CODE]
- `progress.tsx` - Progress bar component wrapping Radix progress primitive. Key: `Progress`, `cn` [SOURCE_CODE]
- `radio-group.tsx` - Styled radio group components backed by Radix primitives. Key: `RadioGroup`, `RadioGroupItem`, `Circle` [SOURCE_CODE]
- `resizable.tsx` - Resizable panel primitives using react-resizable-panels. Key: `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`, `GripVertical` [SOURCE_CODE]
- `scroll-area.tsx` - Custom scroll area with styled scrollbars using Radix. Key: `ScrollArea`, `ScrollBar`, `cn` [SOURCE_CODE]
- `select.tsx` - Accessible select/dropdown components built on Radix primitives. Key: `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectScrollUpButton` [SOURCE_CODE]
- `separator.tsx` - Horizontal/vertical separator component using Radix separator. Key: `Separator`, `cn` [SOURCE_CODE]
- `sheet.tsx` - Slide-in sheet (drawer) components built on Radix dialog. Key: `Sheet`, `SheetContent`, `SheetOverlay`, `sheetVariants`, `SheetTitle` [SOURCE_CODE]
- `sidebar.tsx` - Comprehensive responsive sidebar provider and components. Key: `SIDEBAR_COOKIE_NAME`, `SIDEBAR_COOKIE_MAX_AGE`, `useSidebar`, `SidebarProvider`, `Sidebar` [SOURCE_CODE]
- `skeleton.tsx` - Simple skeleton loader component for UI placeholders. Key: `Skeleton`, `cn` [SOURCE_CODE]
- `slider.tsx` - Radix-based slider UI React component. Key: `Slider` [SOURCE_CODE]
- `sonner.tsx` - Theme-aware Sonner Toaster wrapper. Key: `Toaster` [SOURCE_CODE]
- `switch.tsx` - Radix-based toggle/switch component. Key: `Switch` [SOURCE_CODE]
- `table.tsx` - Composable table UI primitives with styling. Key: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow` [SOURCE_CODE]
- `tabs.tsx` - Radix-based tabs components with styling. Key: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` [SOURCE_CODE]
- `textarea.tsx` - Styled textarea component with forwarded ref. Key: `Textarea` [SOURCE_CODE]
- `toast.tsx` - Radix toast primitives with variant styling. Key: `ToastProvider`, `ToastViewport`, `toastVariants`, `Toast`, `ToastAction` [SOURCE_CODE]
- `toaster.tsx` - App toaster that renders toasts from useToast hook. Key: `Toaster` [SOURCE_CODE]
- `toggle-group.tsx` - Toggle group components with shared variant context. Key: `ToggleGroupContext`, `ToggleGroup`, `ToggleGroupItem` [SOURCE_CODE]
- `toggle.tsx` - Toggle component with class-variance-authority variants. Key: `toggleVariants`, `Toggle` [SOURCE_CODE]
- `tooltip.tsx` - Radix tooltip components with styling. Key: `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` [SOURCE_CODE]
- `use-mobile.tsx` - Hook to detect mobile viewport size. Key: `MOBILE_BREAKPOINT`, `useIsMobile` [SOURCE_CODE]
- `use-toast.ts` - UI toast hook used by shadcn components (client). Key: `reducer`, `toast`, `useToast` [SOURCE_CODE]

## contexts/

- `AuthContext.tsx` - React client-side authentication context providing user state, login/logout, and refresh logic.. Key: `AuthContext`, `AuthProvider`, `useAuth`, `refreshUser`, `login` [SOURCE_CODE]

## hooks/

- `use-mobile.tsx` - A small React hook that reports whether the viewport is considered mobile (<768px).. Key: `MOBILE_BREAKPOINT`, `useIsMobile` [SOURCE_CODE]
- `use-toast.ts` - Client toast hook for showing and managing toasts. Key: `reducer`, `toast`, `useToast`, `genId` [SOURCE_CODE]

## lib/

- `api.ts` - API client wrapper for communicating with the backend. Key: `ApiService`, `API_BASE_URL`, `createDepositSession`, `getUsageHistory` [SOURCE_CODE]
- `auth.ts` - Authentication service for token storage and OAuth flows. Key: `AuthService`, `API_BASE_URL`, `getStoredToken`, `refreshToken` [SOURCE_CODE]
- `blog.ts` - Static blog post loader that reads markdown files. Key: `getAllPosts`, `getPostBySlug`, `postsDirectory` [SOURCE_CODE]
- `utils.ts` - Utility for composing Tailwind class names. Key: `cn` [SOURCE_CODE]

## styles/

- `globals.css` - Alternate/global Tailwind styles and theme variables (duplicate of app globals). Key: `--foreground`, `--sidebar-background`, `.text-balance` [SOURCE_CODE]
