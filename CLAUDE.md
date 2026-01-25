# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run type checking (svelte-check + tsc)

## Environment

Set `VITE_MBTA_API_KEY` with your MBTA API key (get one from https://api-v3.mbta.com/).

## Architecture

Svelte 5 + Vite + TypeScript dashboard for displaying MBTA train schedules and predictions.

**Data Flow:**
- `src/lib/api.ts` - API client for MBTA v3 API. Fetches schedules and real-time predictions, parses JSON:API responses.
- `src/lib/Schedule.svelte` - Uses TanStack Query to fetch and merge predictions with schedules. Predictions replace schedule entries when both exist for the same trip.
- `src/lib/TrainCard.svelte` - Displays arrival time, minutes until arrival, and prediction status (En Route/Awaiting/No Train based on uncertainty values).
- `src/lib/CurrentTime.svelte` - Live clock display.
- `src/App.svelte` - Hardcoded configuration for monitored stops (Ball Square Green-E, Davis/Porter Red line).

**Key Patterns:**
- Uses Svelte 5 runes (`$state`, `$props`)
- TanStack Query for data fetching with 30-second refetch interval
- `notBeforeMins` prop filters out trains arriving too soon to catch
