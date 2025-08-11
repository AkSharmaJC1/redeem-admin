import { useCallback, useEffect, useState } from "react";

import ApiResponse from "../resources/entity/IApiResponse";

import {
	IUseInfiniteScrollParams,
	IUseInfiniteScrollReturn,
	IMessageState,
	DataObject,
} from "../interfaces/commonInterfaces";
import { LIST_RECORDS_LIMIT } from "../constants/commonConstant";
import useSessionExpiredHandler from "./useSessionExpiredHandler";

const useInfiniteScroll = ({
	apiService,
	apiParams,
	limit = LIST_RECORDS_LIMIT,
}: IUseInfiniteScrollParams): IUseInfiniteScrollReturn => {
	const checkSessionExpired = useSessionExpiredHandler();
	const [apiResponse, setApiResponse] = useState<ApiResponse>();
	const [data, setData] = useState<unknown[]>([]);
	const [loading, setLoading] = useState(true);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [prevOffset, setPrevOffset] = useState(0);
	const [message, setMessage] = useState<IMessageState | undefined>();

	/**
	 * Fetch data
	 */
	const fetchData = useCallback(
		async (firstLoad?: boolean, otherParams?: DataObject) => {
			if (offset !== prevOffset || firstLoad) {
				setMessage(undefined);
				setLoading(true);
				if (firstLoad) setData([]);
				const res = await apiService({
					...apiParams,
					offset: firstLoad ? 0 : offset,
					limit: limit,
					...otherParams,
				});

				setApiResponse(res?.data?.data);

				if (res.data && res?.data?.success) {
					const info = res?.data?.data;

					if (info?.length < limit) setHasMore(false);
					else setHasMore(true);
					setPrevOffset(firstLoad ? 0 : offset);
					setOffset(firstLoad ? limit : offset + limit);
					setData(firstLoad ? info : data.concat(info));
					setMessage({ type: "error", description: res?.data?.message });
					setMessage({ type: "success", description: res?.data?.message });
				} else {
					setHasMore(false);
					if (firstLoad) setData([]);
					return checkSessionExpired(
						res?.error?.error || "something_went_wrong"
					);
				}

				setLoading(false);
			}
		},
		[offset, prevOffset, hasMore, apiParams, limit]
	);

	useEffect(() => {
		return () => {
			setApiResponse(undefined);
			setLoading(false);
		};
	}, []);

	/**
	 * Load more jobs on scroll
	 */
	const loadMore = () => {
		setTimeout(() => {
			if (hasMore) {
				fetchData(false);
			}
		}, 500);
	};

	return {
		data,
		hasMore,
		loading,
		apiResponse,
		setData,
		loadMore,
		fetchData,
		setLoading,
		message,
	};
};

export default useInfiniteScroll;
