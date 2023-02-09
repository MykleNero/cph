# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Note: Size/Time Estimates are based on Fibbonaci Sequence (1, 2, 3, 5) with 1 being least effort required

### Tickets:

1. Add a table to store information on `Facility-Agent` relationships

   **Size/Time Estimates:**
   `2` (Probably able to be done in a few hours)

   **Description :**

   We want to provide a way for Facilities to use custom ids to identify agents.

   **Implementation details:**

   Create a table to store the custom agent ids for each facility and, more generally, to represent the relationship between a Facility and the Agents. A possible data model could look like:

   `FacilityAgents`, Unique (`facility_id`, `agent_id`)

   - `id`
     - Primary
     - auto-incrementing
   - `facility_id`
     - Foreign Key to `Facilities`
   - `agent_id`
     - Foreign Key to `Agents`
   - `custom_agent_id`
     - Unique
     - Char field, limited to maybe 25 or 50 characters. This depends how long these ids will be.

   **Acceptance criteria:**

   1. We should have a table that we can use to store the relationships between `Facilities` and `Agents`.
   2. Each `Facility-Agent` relationship should span a single row
   3. There should be a unique column that can be used to store the custom agent ids given by each `Facility`.

   **Assumptions:**

   4. We are using a relational database to hold this data
   5. Agents can work Shifts at multiple facilities
   6. We are working with the following data model:

      Agents

      - `id`

      Facilities

      - `id`
      - `name`

      Shifts

      - `id`
      - `facility_id`
      - `agent_id`
      - ...other columns describing the Shift

2. Update `getShiftsByFacility` to include custom ids

   **Depends On:**

   - `1` - Add a table to store information on `Facility-Agent` relationships

   **Size/Time Estimates:**
   `2` (Probably able to be done in a few hours)

   **Description :**

   A function, `getShiftsByFacility`, is currently used when generating reports. `Agents` are identified by `id` in the reports but we want to allow them to be identified by a custom id provided by the `Facility` who's shifts are being returned.

   **Implementation details:**

   1. One way to accomplish this is to join the table created in `1.` when retrieving `Shifts`. The join would happen on rows in which the `agent_id` is the same between both tables. In the same query, we can select the agents' custom ids and include them in the returned value.
   2. Update tests to ensure custom ids are being included in the return value.

   **Acceptance criteria:**

   3. `getShiftsByFacility` should return the same output with a single difference: Each shift should include the agent's custom id provided by the `Facility` who's shifts are being returned.

3. Update `generateReport` to use custom ids

   **Depends On:**

   - `2` - Update `getShiftsByFacility` to include custom ids

   **Size/Time Estimates:**

   `1` (Probably able to be done in an hour or so)

   **Description:**

   A function, `generateReport`, is currently to generate reports. This function calls `getShiftsByFacility`, which has been updated to return a custom agent id in each shift. When generating the PDF reprt, we should use this custom agent id, if it exists, to identify Agents instead of using their primary `id`. Otherwise, fallback to using the Agent's primary `id`.

   **Implementation details:**

   1. Update field provided to PDF template to use the Facility's custom agent ids.
   2. Update tests to makes sure the custom ids are being used with a fallback

   **Acceptance criteria:**

   3. `getShiftsByFacility` should return the same output with a single difference: Each shift should include the agent's custom id provided by the `Facility` who's shifts are being returned. If this field isn't set, then we should fallback to the Agent's primary `id`.
