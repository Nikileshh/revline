import { EventForm } from "@/components/admin/event-form";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide">
        Create event
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        It goes live on the site the moment you save it.
      </p>
      <div className="mt-8">
        <EventForm />
      </div>
    </div>
  );
}
