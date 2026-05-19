import { useState, useEffect, useCallback } from "react";

const NAME_KEY = "tp:employee";
const JOB_KEY = "tp:jobtitle";

export function useEmployeeName() {
  const [name, setName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const rawName = localStorage.getItem(NAME_KEY);
      if (rawName) setName(JSON.parse(rawName) as string);
      const rawJob = localStorage.getItem(JOB_KEY);
      if (rawJob) setJobTitle(JSON.parse(rawJob) as string);
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const save = useCallback((newName: string, newJob: string) => {
    const n = newName.trim();
    const j = newJob.trim();
    if (!n || !j) return;
    localStorage.setItem(NAME_KEY, JSON.stringify(n));
    localStorage.setItem(JOB_KEY, JSON.stringify(j));
    setName(n);
    setJobTitle(j);
  }, []);

  return { name, jobTitle, ready, save };
}
