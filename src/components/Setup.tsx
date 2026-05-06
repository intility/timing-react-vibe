import { Ellipsis, Grid, Message, Section } from "@intility/bifrost-react";

const steps: Array<{
  name: string;
  docs: string;
  variables: Array<{
    name: string;
    description: string;
    value: string;
  }>;
}> = [
  {
    name: "Platform registration",
    docs: "https://github.com/intility/aa349-vibe",
    variables: [
      {
        name: "App name",
        description: "DNS-1123 name used for namespace, hostname, and image",
        value: "timing-react-vibe",
      },
      {
        name: "App URL",
        description: "Hostname assigned by the platform Gateway",
        value: "timing-react-vibe.aa349-1l5zl3.intility.dev",
      },
    ],
  },
];

function SetupStep({ step }: { step: (typeof steps)[number] }) {
  return (
    <Section>
      <a
        key={step.name}
        className="bf-neutral-link"
        href={step.docs}
        target="_blank"
        rel="noreferrer"
      >
        <Section.Header arrow style={{ borderBottom: "none" }}>
          <span className="bf-neutral-link-text">{step.name}</span>
        </Section.Header>
      </a>
      <Section.Content background="base-2" borderTop={false}>
        <Grid gap={16}>
          {step.variables.map((variable) => (
            <Message
              state={variable.value.startsWith("__") ? "alert" : "success"}
              key={variable.name}
              header={variable.name}
            >
              <p>
                <i>
                  <Ellipsis>{variable.value}</Ellipsis>
                </i>
              </p>
              {variable.description}
            </Message>
          ))}
        </Grid>
      </Section.Content>
    </Section>
  );
}

export default function Setup() {
  return (
    <Grid cols={1} small={2}>
      {steps.map((step) => (
        <SetupStep key={step.name} step={step} />
      ))}
    </Grid>
  );
}
