"use client";

import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EventQuestion, Registration } from "@/types";

interface RegistrationsTableProps {
  registrations: Registration[];
  questions: EventQuestion[];
  eventTitle: string;
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function RegistrationsTable({
  registrations,
  questions,
  eventTitle,
}: RegistrationsTableProps) {
  function downloadCsv() {
    const headers = [
      "Name",
      "Age",
      "Gender",
      "Phone",
      "Emergency contact",
      "Blood group",
      "Email",
      "Status",
      "Registered at",
      ...questions.map((q) => q.label),
    ];
    const rows = registrations.map((r) => [
      r.name,
      String(r.age),
      r.gender ?? "",
      r.phone,
      r.emergency_contact ?? "",
      r.blood_group ?? "",
      r.email ?? "",
      r.status,
      new Date(r.created_at).toLocaleString("en-IN"),
      ...questions.map((q) => r.answers[q.id] ?? ""),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle.toLowerCase().replace(/\s+/g, "-")}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (registrations.length === 0) {
    return (
      <p className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No registrations yet for this event.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={downloadCsv}>
          <Download className="size-4" aria-hidden />
          Export CSV
        </Button>
      </div>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Emergency</TableHead>
              <TableHead>Blood</TableHead>
              <TableHead>Status</TableHead>
              {questions.map((q) => (
                <TableHead key={q.id}>{q.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium">
                  {r.name}
                  {r.email && (
                    <span className="block text-xs text-muted-foreground">{r.email}</span>
                  )}
                </TableCell>
                <TableCell>{r.age}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {r.gender ?? "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap">{r.phone}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {r.emergency_contact ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{r.blood_group ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "confirmed" ? "default" : "outline"}>
                    {r.status}
                  </Badge>
                </TableCell>
                {questions.map((q) => (
                  <TableCell key={q.id} className="max-w-56 text-muted-foreground">
                    <span className="line-clamp-2">{r.answers[q.id] ?? "—"}</span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
