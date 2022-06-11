import { fileUrl } from "./env";
export function loadMotionIcon(type, sportType) {
  let url;
  switch (type) {
    case 1:
      url = `/0_AIKS_IMG/sport_icon/pk_${sportType}.png`
      break;
    case 2:
      url = `/0_AIKS_IMG/sport_icon/tl_${sportType}.png`
      break;
    case 3:
      url = `/0_AIKS_IMG/sport_icon/tl_ash_${sportType}.png`
      break;
    case 4:
      url = `/0_AIKS_IMG/sport_icon/td_${sportType}.png`;
      break;
    case 5:
      url = `/0_AIKS_IMG/sport_icon/td_ash_${sportType}.png`;
      break;
    default:
      url = `/0_AIKS_IMG/sport_icon/${sportType}.png`
      break;
  }
  return fileUrl + url
}