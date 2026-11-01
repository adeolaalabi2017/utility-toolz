import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Utility Toolz stores on your device and where your calculator inputs go.",
  alternates: { canonical: "/privacy" },
};

const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="1 November 2026">
      <p>
        Utility Toolz is a set of calculators and utilities that run in your web browser. This page explains
        what information the site handles and why.
      </p>

      <h2>What you type into the tools</h2>
      <ul>
        <li>Calculations run in your browser. The numbers and text you enter are not sent to our servers.</li>
        <li>
          Some tools keep your inputs in the page address (for example <code>?revenue=45000</code>) so you can
          share or bookmark a scenario. Anyone you send that link to can see those values.
        </li>
        <li>The currency converter fetches current exchange rates from our server. It does not send your amounts.</li>
      </ul>

      <h2>What is stored on your device</h2>
      <p>The site uses your browser&apos;s local storage, not cookies, to remember:</p>
      <ul>
        <li>tools you have starred,</li>
        <li>your light, dark or system theme choice,</li>
        <li>the currency you chose for displaying amounts.</li>
      </ul>
      <p>You can clear these at any time by clearing this site&apos;s data in your browser.</p>

      <h2>Advertising</h2>
      <p>
        The free tools may be supported by advertising. If ads are enabled, an advertising provider such as
        Google AdSense may use cookies or similar technologies to show and measure ads. Where the law requires
        it, we will ask for your consent first, and this page will name the provider and link to its policy.
      </p>

      <h2>Server logs</h2>
      <p>
        Like most websites, our hosting provider keeps short-lived technical logs (such as IP address, browser
        type and the page requested) to run and secure the service.
      </p>

      <h2>Contact</h2>
      <p>
        {contact ? (
          <>
            Questions about privacy: <a className="underline" href={`mailto:${contact}`}>{contact}</a>.
          </>
        ) : (
          <>For privacy questions, use the contact details published on this site.</>
        )}
      </p>
    </LegalPage>
  );
}
