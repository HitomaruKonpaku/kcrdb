import { ApiPropertyOptional } from '@nestjs/swagger'
import { MstShipDto } from '../../mst/dto/mst-ship.dto'
import { MstSlotitemDto } from '../../mst/dto/mst-slotitem.dto'

export class RemodelMetadataDto {
  @ApiPropertyOptional({ type: [MstShipDto] })
  api_mst_ship: MstShipDto[]

  @ApiPropertyOptional({ type: [MstSlotitemDto] })
  api_mst_slotitem: MstSlotitemDto[]
}
