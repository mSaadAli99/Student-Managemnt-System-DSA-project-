import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import apihandle from "../api/apihandle";

export default function PendingInvites() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // classId that is loading

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const res = await apihandle.getPendingInvites(); // implement in apihandle
      setInvites(res.invitations || []);
    } catch (err) {
      toast.error("Failed to fetch invites");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (classId, action) => {
    try {
      setActionLoading(classId);
      await apihandle.respondToInvite({ classId, action });
      toast.success(`Invite ${action}ed successfully!`);
      setInvites((prev) => prev.filter((i) => i.classId !== classId));
    } catch (err) {
      toast.error(err.message || "Failed to respond to invite");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pending Invites</h1>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-md" />
          ))}
        </div>
      ) : invites.length === 0 ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <p className="text-muted-foreground text-xl">🚫 No pending invites.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {invites.map((invite) => (
            <Card key={invite.classId} className="p-4">
              <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold">
                  {invite.className}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{invite.classDescription}</p>
                <p>Teacher: {invite.teacherEmail}</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleRespond(invite.classId, "accept")}
                  disabled={actionLoading === invite.classId}
                >
                  {actionLoading === invite.classId
                    ? "Processing..."
                    : "Accept Invite"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
