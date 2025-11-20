import { create } from "zustand";

interface BuyerFormState {
  buyerData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;

    companyName: string;
    registrationNumber: string;
    companyAddress: string;
    verificationDocument: File | null;

    contactPerson: {
      name: string;
      position: string;
    };
  };

  updateBuyerData: (data: Partial<BuyerFormState["buyerData"]>) => void;
  resetBuyerData: () => void;
}

export const useBuyerFormStore = create<BuyerFormState>((set) => ({
  buyerData: {
    fullName: "",
    email: "",
    password: "",
    phone: "",

    companyName: "",
    registrationNumber: "",
    companyAddress: "",
    verificationDocument: null,

    contactPerson: {
      name: "",
      position: "",
    },
  },

  updateBuyerData: (data) =>
    set((state) => ({
      buyerData: { ...state.buyerData, ...data },
    })),

  resetBuyerData: () =>
    set({
      buyerData: {
        fullName: "",
        email: "",
        password: "",
        phone: "",

        companyName: "",
        registrationNumber: "",
        companyAddress: "",
        verificationDocument: null,

        contactPerson: {
          name: "",
          position: "",
        },
      },
    }),
}));
