# Gifthealth Engineering Project

## How to run

Install dependencies first:

```bash
npm install
```

Run with a file name:

```bash
npm start input.txt
```

Run with stdin:

```bash
cat input.txt | npx ts-node cli.ts
```

## What the code does

The input is one event per line. Each line has a patient name, a drug name, and an event type.

The program keeps track of each prescription by using the patient name plus drug name as a unique key. That lets it know which events belong together.

I used a few basic data structures:

- `Set` to remember which prescriptions were created
- `Map` to track active fills for each prescription
- `Map` again to store the summary for each patient

This was enough for the problem and it keeps the logic pretty direct.

## Design notes

I split the code into small pieces.

`app.ts` handles parsing, event processing, and report formatting. `cli.ts` only reads input and prints output. `test.ts` checks the main behavior.

That split helps because the business logic can be tested without the CLI, and the CLI stays very small.

I also added stdin support because the project asks for both file input and piped input. That makes the tool work like a normal command line program.

## Sorting

The sample output shows that the report is not just in input order. I sorted the final report by total fills descending. If two patients have the same fill count, I sort by income ascending.

That was the smallest rule I could use that still matches the example output.

## Testing

The tests are simple and focused.

- `parseLine()` is checked with valid and invalid lines
- `processEvents()` is checked with the sample event list
- `formatReport()` is checked with the expected output text
