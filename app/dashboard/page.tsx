"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/Superbase";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // 🔐 check auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/";
      } else {
        setUserId(data.user.id);
      }
    });
  }, []);

  // 📥 fetch bookmarks
  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    fetchBookmarks();

    // 🔥 realtime
   const channel = supabase
    .channel("bookmarks-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookmarks" },
      (payload) => {
        // optional: only refetch if change from another tab
        fetchBookmarks();
      }
    )
    .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ➕ add
 const addBookmark = async () => {
  if (!title || !url || !userId) return;

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      title,
      url,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  // 🔥 instant UI update
  setBookmarks((prev) => [data, ...prev]);

  setTitle("");
  setUrl("");
};


  // ❌ delete
 const deleteBookmark = async (id: string) => {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  // 🔥 instant UI update
  setBookmarks((prev) => prev.filter((b) => b.id !== id));
};



  // 🚪 logout
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
  <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
    <div className="max-w-2xl mt-10 mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-center sm:text-left">
          My Bookmarks
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer w-full sm:w-auto"
        >
          Logout
        </button>
      </div>

      {/* Add form */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={addBookmark}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer w-full sm:w-auto whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {bookmarks.length === 0 && (
          <p className="text-gray-500 text-center">
            No bookmarks yet
          </p>
        )}

        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <a
              href={b.url}
              target="_blank"
              className="text-blue-600 font-medium break-all hover:underline"
            >
              {b.title}
            </a>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500 cursor-pointer font-medium w-full sm:w-auto text-left sm:text-right"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}
