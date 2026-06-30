import { useEffect, useState } from "react";
import * as projectApi from "../api/projectApi";

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);

      const projects = await projectApi.getProjects();

      setProjects(projects);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refreshProjects: loadProjects,
  };
}
