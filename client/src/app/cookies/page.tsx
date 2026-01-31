'use client';

import Link from 'next/link';
import { Cookie } from 'lucide-react';

export default function CookiesPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="container max-w-4xl mx-auto px-4">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-8">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-foreground">Cookie Policy</span>
                </nav>

                {/* Header */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10">
                            <Cookie className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">
                            Cookie Policy
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Last updated: January 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none space-y-8">

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">What Are Cookies?</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Cookies are small text files that are placed on your computer or mobile device when you visit our website.
                            They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">How We Use Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use cookies for the following purposes:
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Performance Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Functionality Cookies:</strong> These cookies allow the website to remember choices you make (such as your user name, language, or region) and provide enhanced, more personal features.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Shopping Cart:</strong> We use cookies to remember items you've added to your cart and to process your checkout.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Managing Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability
                            of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.
                            It may also stop you from saving customized settings like login information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Third-Party Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may use third-party services such as Google Analytics to help us understand how our website is being used.
                            These services may use cookies to collect information about your visit to our site and other websites.
                        </p>
                    </section>

                    <section className="space-y-4 pt-8 border-t border-border">
                        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Updates to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page
                            and updating the "Last updated" date at the top of this policy.
                        </p>
                    </section>

                    {/* Contact CTA */}
                    <div className="mt-12 p-8 rounded-2xl bg-secondary/10 border border-border">
                        <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-2">Questions About Cookies?</h3>
                        <p className="text-muted-foreground mb-4">
                            If you have any questions about our use of cookies, please contact us.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
