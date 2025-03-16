import { useCallback } from "react";
import { Abonement } from "../types/Abonement";
import { abonementService } from "../services/abonementService";
import { getErrorMessage } from "../utils/utils";
import { useNotification } from "./useNotification";
import { useClientContext } from "../pages/Account/UserList/User/User";

interface UseAbonementManagementProps {
  abonement: Abonement;
  onUpdate?: (updatedAbonement: Abonement) => void;
  onDelete?: (id: number | string) => void;
}

export const useAbonementManagement = ({
  abonement,
  onUpdate,
  onDelete,
}: UseAbonementManagementProps) => {
  const { notification, handleNotification } = useNotification();

  // Try to get context, but don't throw if it's not available
  let contextValue: {
    client: any;
    setClient: ((client: any) => void) | null;
    refreshClient: () => Promise<void>;
  } = {
    client: null,
    setClient: null,
    refreshClient: () => Promise.resolve(),
  };
  try {
    contextValue = useClientContext();
  } catch (error) {
    // Context not available, will use direct callback props instead
  }

  const { client, setClient, refreshClient } = contextValue;

  const handleToggleFreeze = useCallback(async () => {
    try {
      const updatedAbonement = await abonementService.update(abonement.id, {
        ...abonement,
        extended: !abonement.extended,
      });

      // Option 1: Use provided callback
      if (onUpdate) {
        onUpdate(updatedAbonement);
      }
      // Option 2: Update through context if available
      else if (setClient && client) {
        setClient({
          ...client,
          abonements: client.abonements.map((el: { id: string | number }) =>
            el.id === abonement.id ? updatedAbonement : el
          ),
        });
      }

      handleNotification("sucsess");

      return updatedAbonement;
    } catch (error) {
      handleNotification(getErrorMessage(error), "error");
      return null;
    }
  }, [abonement, onUpdate, setClient, client]);

  const handleDelete = useCallback(async () => {
    try {
      await abonementService.remove(abonement.id);

      // Option 1: Use provided callback
      if (onDelete) {
        onDelete(abonement.id);
      }
      // Option 2: Update through context if available
      else if (client && setClient) {
        setClient({
          ...client,
          abonements: client.abonements.filter(
            (a: { id: string | number }) => a.id !== abonement.id
          ),
        });
      }
      // Option 3: Refresh client data
      else {
        await refreshClient();
      }

      handleNotification(
        `Abonement with id: ${abonement.id} was successfully deleted`
      );
      return true;
    } catch (error) {
      handleNotification(getErrorMessage(error), "error");
      return false;
    }
  }, [abonement.id, onDelete, client, setClient, refreshClient]);

  return {
    notification,
    handleToggleFreeze,
    handleDelete,
  };
};
