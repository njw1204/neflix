export function chunkArrayInGroups<T>(arr: T[], size: number) {
  const myArray = [];

  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }

  return myArray;
}

export function getYoutubeVideoUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function getYoutubeThumbnailUrl(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
}
