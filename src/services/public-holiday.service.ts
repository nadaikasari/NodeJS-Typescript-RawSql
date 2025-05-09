import axios from 'axios';

export const fetchPublicHolidayDatas = async () => {
  try {
    const response = await axios.get('https://date.nager.at/api/v3/PublicHolidays/2024/ID', {
      headers: {
        Authorization: `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
      },
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Public holiday datas fetched successfully',
      data: response.data,
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,
      success: false,
      message: 'Failed to fetch public holiday datas',
      data: null,
      error: error.message,
    };
  }
};
