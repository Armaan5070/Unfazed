import api from "../../api/axiosInstance";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/navbar";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const defaultSchedule = {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,

  sessionDurationMinutes: 50,
  bufferTimeMinutes: 10,
  minimumAdvanceTime: 120,

  weeklySchedule: [
    {
      day: "monday",
      isWorking: true,
      slots: [
        {
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    },
    {
      day: "tuesday",
      isWorking: true,
      slots: [
        {
          startTime: "10:00",
          endTime: "16:00",
        },
      ],
    },
    {
      day: "wednesday",
      isWorking: true,
      slots: [
        {
          startTime: "09:00",
          endTime: "18:00",
        },
      ],
    },
    {
      day: "thursday",
      isWorking: true,
      slots: [
        {
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    },
    {
      day: "friday",
      isWorking: true,
      slots: [
        {
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    },
    {
      day: "saturday",
      isWorking: false,
      slots: [
        {
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    },
    {
      day: "sunday",
      isWorking: false,
      slots: [
        {
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    },
  ],

  blockedDates: [],
};

export default function Schedule() {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: defaultSchedule,
  });

  // Load an existing schedule when the page opens
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const response = await api.get("therapist/schedule");

        if (response.status === 404) {
          return;
        }

        const data = response.data;

        // Strip metadata properties that shouldn't be in form state
        const { _id, __v, therapistId, message, ...cleanData } = data;

        // Ensure day is populated for every schedule row
        if (cleanData.weeklySchedule && Array.isArray(cleanData.weeklySchedule)) {
          cleanData.weeklySchedule = cleanData.weeklySchedule.map((item, index) => ({
            ...item,
            day: days[index] || item.day,
          }));
        }

        cleanData.blockedDates = cleanData.blockedDates || [];

        // Put database data into the form
        reset(cleanData);
      } catch (error) {
        console.error("Error loading schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      // Guarantee `day` is explicitly included in each weeklySchedule item before sending
      const payload = {
        ...data,
        weeklySchedule: data.weeklySchedule.map((item, index) => ({
          ...item,
          day: days[index],
        })),
      };

      console.log("DATA BEFORE REQUEST:", payload);
      const response = await api.put("therapist/schedule", payload);
      console.log("RESPONSE:", response.data);

      const savedSchedule = response.data.schedule || response.data;

      // Clean metadata before resetting form state
      const { _id, __v, therapistId, message, ...cleanSchedule } = savedSchedule;

      if (cleanSchedule.weeklySchedule) {
        cleanSchedule.weeklySchedule = cleanSchedule.weeklySchedule.map((item, index) => ({
          ...item,
          day: days[index],
        }));
      }

      cleanSchedule.blockedDates = cleanSchedule.blockedDates || [];

      // Update form with clean object
      reset(cleanSchedule);

      alert("Schedule saved successfully");
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule");
    }
  };

  if (loading) {
    return <p className="p-4 text-sm text-zinc-500">Loading schedule...</p>;
  }

  return (
    <>
    <Navbar/>
    <div className="max-w-2xl mx-auto my-4 sm:my-8 p-4 sm:p-6 bg-white border border-zinc-200 rounded-xl shadow-sm text-zinc-900 space-y-8">
      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight border-b border-zinc-200 pb-4">
        My Schedule
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* =============================== */}
        {/* WEEKLY SCHEDULE */}
        {/* =============================== */}

        <section className="space-y-4">
          <h2 className="text-base font-medium text-zinc-900 border-b border-zinc-100 pb-2">
            Weekly Schedule
          </h2>

          <div className="space-y-1">
            {days.map((day, index) => {
              const enabled = watch(`weeklySchedule[${index}].isWorking`);

              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 py-3 sm:py-2 border-b border-zinc-100 last:border-0"
                >
                  {/* HIDDEN INPUT FOR DAY PROPERTY */}
                  <input
                    type="hidden"
                    value={day}
                    {...register(`weeklySchedule[${index}].day`)}
                  />

                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 min-w-[120px] cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-zinc-300 accent-black focus:ring-black"
                      {...register(`weeklySchedule[${index}].isWorking`)}
                    />

                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>

                  <div className="flex items-center gap-2 pl-6 sm:pl-0">
                    <input
                      type="time"
                      disabled={!enabled}
                      className="w-full sm:w-auto rounded-md border border-zinc-300 px-2.5 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                      {...register(
                        `weeklySchedule[${index}].slots[0].startTime`
                      )}
                    />

                    <span className="text-sm text-zinc-400 font-normal">
                      to
                    </span>

                    <input
                      type="time"
                      disabled={!enabled}
                      className="w-full sm:w-auto rounded-md border border-zinc-300 px-2.5 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                      {...register(
                        `weeklySchedule[${index}].slots[0].endTime`
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =============================== */}
        {/* APPOINTMENT SETTINGS */}
        {/* =============================== */}

        <section className="space-y-4">
          <h2 className="text-base font-medium text-zinc-900 border-b border-zinc-100 pb-2">
            Appointment Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="sessionDuration"
                className="block text-xs font-medium text-zinc-600 mb-1.5"
              >
                Session Duration
              </label>

              <select
                id="sessionDuration"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                {...register("sessionDurationMinutes", {
                  valueAsNumber: true,
                })}
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="bufferTime"
                className="block text-xs font-medium text-zinc-600 mb-1.5"
              >
                Buffer Time
              </label>

              <select
                id="bufferTime"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                {...register("bufferTimeMinutes", {
                  valueAsNumber: true,
                })}
              >
                <option value={0}>No buffer</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="minimumAdvanceTime"
                className="block text-xs font-medium text-zinc-600 mb-1.5"
              >
                Minimum Advance Notice
              </label>

              <select
                id="minimumAdvanceTime"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                {...register("minimumAdvanceTime", {
                  valueAsNumber: true,
                })}
              >
                <option value={0}>No minimum</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={1440}>24 hours</option>
                <option value={2880}>48 hours</option>
              </select>
            </div>
          </div>
        </section>

        {/* =============================== */}
        {/* TIMEZONE */}
        {/* =============================== */}

        <section className="space-y-4">
          <h2 className="text-base font-medium text-zinc-900 border-b border-zinc-100 pb-2">
            Timezone
          </h2>

          <div>
            <input
              type="text"
              className="w-full sm:w-80 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              {...register("timeZone")}
            />
          </div>
        </section>

        {/* =============================== */}
        {/* LEAVES */}
        {/* =============================== */}

        <section className="space-y-3">
          <h2 className="text-base font-medium text-zinc-900 border-b border-zinc-100 pb-2">
            Days Off / Leave
          </h2>

          <p className="text-xs text-zinc-500">
            Calendar will update the "leaves" field in React Hook Form.
          </p>

          <button
            type="button"
            onClick={() => {
              const currentLeaves = watch("blockedDates") || [];

              setValue("blockedDates", [
                ...currentLeaves,
                "2026-08-25",
              ]);
            }}
            className="px-3 py-1.5 text-xs font-medium border border-zinc-300 rounded-md bg-white text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Add Test Leave
          </button>

          <pre className="p-3 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-mono text-zinc-700 overflow-x-auto">
            {JSON.stringify(watch("blockedDates"), null, 2)}
          </pre>
        </section>

        {/* =============================== */}
        {/* SUBMIT */}
        {/* =============================== */}

        <div className="pt-4 border-t border-zinc-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </form>
    </div>
    </>
  );

}