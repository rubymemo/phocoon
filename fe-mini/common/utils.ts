const host = 'https://w.phocoongame.cn';

export const httpsRequestResult = (httpRes : { statusCode : number; data : any }, noshowerr?: boolean) : any | null => {
	if (httpRes.statusCode === 200) {
		const data = httpRes.data;
		if (data.code !== 0) {
			if(!noshowerr) {
				uni.showToast({
					icon: 'none',
					title: data.msg
				})
			}
			return null;
		} else {
			// 成功
			return data.data || {};
		}
	} else {
		uni.showToast({
			icon: 'none',
			title: '系统错误，请联系管理员'
		})
	}
	return null
}

export const httpsRequest = async (url : string, params : Record<string, any>, noheader?: boolean, noshowerr?: boolean) => {
	const token = uni.getStorageSync('token');
	const header = noheader ? undefined : {
		token: token
	}
	const res = await uni.request({
		url: host + url,
		method: 'POST',
		data: params,
		header: header
	});
	const data = httpsRequestResult(res, noshowerr);
	return data;
}