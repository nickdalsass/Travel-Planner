"use client";

import { useState } from "react";
import { Button } from "@mantine/core";
import { supabase } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

type DeleteTripButtonProps = {
  tripId: number;
  onDeleted?: () => void;
};

export default function DeleteTripButton({ tripId, onDeleted }: DeleteTripButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!tripId) return;

    const confirmed = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmed) return;

    setLoading(true);
    const { error } = await supabase.from("TRIPS").delete().eq("id", tripId);
    setLoading(false);

    if (error) {
      console.error("Error deleting trip:", error);
      return;
    }

    if (onDeleted) {
      onDeleted();
    }
  };

  return (
    <Button
    leftSection={<Trash2 />}
      color="#b8626cff"
      size="sm"
      mt="sm"
      loading={loading}
      onClick={handleDelete}
    >
      Delete Trip
    </Button>
  );
}
