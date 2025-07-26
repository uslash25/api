export interface BaseResponseDto {

  /**
   * Status code
   */
  status: number;

  /**
   * Instance
   */
  instance: string;

  /**
   * Detail
   */
  detail: string | null;

  /**
   * Data
   */
  data: unknown | null;

  /**
   * Timestamp
   */
  timestamp: Date;
}
