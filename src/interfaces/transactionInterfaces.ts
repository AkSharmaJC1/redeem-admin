export interface ICommonTransactions {
	id: number;
	bookingType: string;
	user: { name: string; email: string };
	event: { name: string };
}
export interface ITransactionList extends ICommonTransactions {
	payment: {
		totalAmount: number;
		transactionId: string;
		transactionDateTime: Date;
	};
	createdAt: Date;
}

export interface ICancelationTransactions extends ICommonTransactions {
	id: number;
	bookingType: string;
	payment: { amount: number; transactionId: string };
	updatedAt: Date;
	user: { name: string; email: string };
	event: { name: string };
}
