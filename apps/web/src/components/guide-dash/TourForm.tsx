"use client";

import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { PlaceSummary } from "@seoul/shared";
import { createTourAction, updateTourAction } from "@/actions/tours";
import { LazyPinPicker } from "@/components/map/lazy";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Field } from "@/components/ui/Field";
import { TimePicker } from "@/components/ui/TimePicker";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import { pick } from "@/lib/format";
import { idleState } from "@/lib/form";

export type TourFormDefaults = {
  title: string;
  description: string;
  date: string;
  time: string;
  durationMin: number;
  capacity: number;
  pricePerPerson: number;
  meetingName: string;
  meeting: { lat: number; lng: number } | null;
  placeIds: string[];
};

type TourFormProps = {
  tourId?: string;
  defaults: TourFormDefaults;
  places: PlaceSummary[];
  minDate: string;
};

const MAX_STOPS = 10;
const SEARCH_LIMIT = 8;

export const TourForm = ({
  tourId,
  defaults,
  places,
  minDate,
}: TourFormProps) => {
  const t = useTranslations("GuideDash");
  const locale = useLocale();
  const [state, formAction] = useActionState(
    tourId ? updateTourAction : createTourAction,
    idleState,
  );
  const [stops, setStops] = useState(defaults.placeIds);
  const [query, setQuery] = useState("");
  const errors = state.fieldErrors ?? {};

  const byId = new Map(places.map((place) => [place.id, place]));
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? places
        .filter((place) => !stops.includes(place.id))
        .filter(
          (place) =>
            place.nameEn.toLowerCase().includes(needle) ||
            place.nameKo.toLowerCase().includes(needle),
        )
        .slice(0, SEARCH_LIMIT)
    : [];

  const move = (index: number, delta: number) =>
    setStops((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      if (item) next.splice(index + delta, 0, item);
      return next;
    });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {tourId ? <input type="hidden" name="tourId" value={tourId} /> : null}
      {stops.map((id) => (
        <input key={id} type="hidden" name="placeIds" value={id} />
      ))}
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}

      <Field label={t("form.title")} htmlFor="title" error={errors.title}>
        <Input
          id="title"
          name="title"
          defaultValue={defaults.title}
          required
          minLength={5}
          maxLength={100}
        />
      </Field>
      <Field
        label={t("form.description")}
        htmlFor="description"
        error={errors.description}
      >
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={defaults.description}
          placeholder={t("form.descriptionPlaceholder")}
          required
          minLength={20}
          maxLength={2000}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("form.date")} htmlFor="date" error={errors.startsAt}>
          <DatePicker
            id="date"
            name="date"
            min={minDate}
            defaultValue={defaults.date}
            required
          />
        </Field>
        <Field label={t("form.time")} htmlFor="time">
          <TimePicker id="time" name="time" defaultValue={defaults.time} />
        </Field>
        <Field
          label={t("form.duration")}
          htmlFor="durationMin"
          error={errors.durationMin}
        >
          <Input
            id="durationMin"
            name="durationMin"
            type="number"
            min={30}
            max={720}
            step={15}
            defaultValue={defaults.durationMin}
            required
          />
        </Field>
        <Field
          label={t("form.capacity")}
          htmlFor="capacity"
          error={errors.capacity}
        >
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={2}
            max={20}
            defaultValue={defaults.capacity}
            required
          />
        </Field>
        <Field
          label={t("form.price")}
          htmlFor="pricePerPerson"
          error={errors.pricePerPerson}
          className="sm:col-span-2"
        >
          <Input
            id="pricePerPerson"
            name="pricePerPerson"
            type="number"
            min={5000}
            max={1000000}
            step={1000}
            defaultValue={defaults.pricePerPerson}
            required
          />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-2sm font-medium">
          {t("form.meeting")}
        </legend>
        <Field
          label={t("meetingName")}
          htmlFor="meetingName"
          error={errors.meetingName}
        >
          <Input
            id="meetingName"
            name="meetingName"
            defaultValue={defaults.meetingName}
            placeholder={t("meetingNamePlaceholder")}
            required
            minLength={3}
          />
        </Field>
        <LazyPinPicker
          latName="meetingLat"
          lngName="meetingLng"
          initial={defaults.meeting}
          hint={t("pickOnMap")}
          className="h-64"
        />
        {errors.meetingLat || errors.meetingLng ? (
          <p className="text-xs text-destructive">{t("pickOnMap")}</p>
        ) : null}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-2sm font-medium">{t("form.stops")}</legend>
        {stops.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noStopsYet")}</p>
        ) : null}
        <ol className="flex flex-col gap-1.5">
          {stops.map((id, index) => {
            const place = byId.get(id);
            if (!place) return null;
            return (
              <li
                key={id}
                className="flex items-center gap-2 glassy-md py-1.5 pr-1.5 pl-3"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-2xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {pick(place, "name", locale)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  aria-label={t("moveUp")}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={index === stops.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label={t("moveDown")}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() =>
                    setStops((current) => current.filter((s) => s !== id))
                  }
                  aria-label={t("removeStop")}
                >
                  <X />
                </Button>
              </li>
            );
          })}
        </ol>
        {stops.length < MAX_STOPS ? (
          <div className="flex flex-col gap-1">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchStops")}
                className="pl-10"
                aria-label={t("searchStops")}
              />
            </div>
            {matches.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => {
                  setStops((current) => [...current, place.id]);
                  setQuery("");
                }}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-card-hover"
              >
                <Plus className="size-4 text-primary" />
                {pick(place, "name", locale)}
                <span className="text-xs text-muted-foreground">
                  {place.district}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </fieldset>

      <SubmitButton size="lg" className="self-start">
        {tourId ? t("form.update") : t("form.publish")}
      </SubmitButton>
    </form>
  );
};
