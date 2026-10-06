import { PageIntro } from "../components/ui/PageIntro";
import { Panel } from "../components/ui/Panel";
import { SourceNote } from "../components/ui/SourceNote";

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function PlanView() {
  return (
    <div className="grid gap-4 [&_ol]:grid [&_ol]:list-decimal [&_ol]:gap-1.5 [&_ol]:pl-5.5 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-1.5 [&_ul]:pl-5.5">
      <PageIntro title="How to train.">
        What to watch for, then how to practice without hating every minute.
      </PageIntro>

      <Panel title="What costs you accuracy">
        <ul>
          <li>
            <b>Omission:</b> anything you dropped, including hedges and repetitions.
          </li>
          <li>
            <b>Addition:</b> anything you added, like reassurance or an explanation.
          </li>
          <li>
            <b>Distortion:</b> a number, negation, time, name or dose that changed.
          </li>
          <li>
            <b>Register shift:</b> softening a blunt line or dressing up a casual one.
          </li>
          <li>
            <b>Terminology:</b> a description in place of the proper term. This is why the app checks the
            exact glossary wording.
          </li>
          <li>
            <b>Protocol:</b> third-person rendering, side conversations, guessing instead of asking.
          </li>
        </ul>
        <p>The app asks for 80% on a rung before opening the next one.</p>
      </Panel>

      <Panel title="How this app is built for a brain that won't sit still">
        <ul>
          <li>
            <b>Sprints, not sessions.</b> 6 to 20 items, about three minutes. Short sessions spread over the
            day beat one long block for retention.
          </li>
          <li>
            <b>Recall, not rereading.</b> Every item makes you produce the answer before you see it. Retrieval
            with feedback is the best-supported study method there is.
          </li>
          <li>
            <b>Leitner boxes.</b> Misses come back sooner, known items fade out. "Redo my misses" is the
            fastest win on a bad day.
          </li>
          <li>
            <b>Interleaving.</b> The boss call mixes everything. It feels harder, and that difficulty is what
            makes it stick.
          </li>
          <li>
            <b>A clock.</b> The ring turns studying into a game with a deadline, and the real call doesn't
            wait either.
          </li>
        </ul>
        <SourceNote>
          Sources:{" "}
          <ExternalLink href="http://www.lscp.net/persons/ramus/docs/EPR20.pdf">
            meta-analysis on spaced retrieval practice
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://files.eric.ed.gov/fulltext/ED536925.pdf">
            Using Spacing to Enhance Diverse Forms of Learning
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://www.shimmer.care/blog/adhd-study-strategies">
            Shimmer, ADHD study strategies
          </ExternalLink>
          .
        </SourceNote>
      </Panel>

      <Panel title="The minimum viable day">
        <ol>
          <li>Open the app, hit the big button. One sprint. That's the whole commitment.</li>
          <li>If you're still going, run "Redo my misses".</li>
          <li>Later in the day, one more sprint on any rung. Spacing them out is the point.</li>
          <li>
            Once you pass rung 6, add shadowing off the app: play any Spanish medical video and repeat it a
            few words behind the speaker for two minutes.
          </li>
          <li>Once a week, run the boss call and the protocol quiz.</li>
        </ol>
        <p>Call setup: a quiet room, a wired headset, water, paper for numbers and negations.</p>
      </Panel>
    </div>
  );
}
