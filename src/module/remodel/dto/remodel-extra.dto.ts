import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsIn, IsOptional } from 'class-validator'
import { ToBoolean } from '../../../shared/decorator/to-boolean.decorator'
import { KcsapiExtraDto } from '../../../shared/kcsapi/dto/kcsapi-extra.dto'

export class RemodelExtraDto extends KcsapiExtraDto {
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  metadata?: boolean

  @IsOptional()
  @IsIn([
    'ja',
    'en',
    'de',
    'es',
    'fr',
    'id',
    'it',
    'kr',
    'nl',
    'pt',
    'ru',
    'scn',
    'tcn',
    'tcn-yue',
    'tctn',
    'th',
    'ua',
    'vi',
  ])
  @ApiPropertyOptional({
    examples: {
      ja: { value: 'ja' },
      en: { value: 'en' },
      de: { value: 'de' },
      es: { value: 'es' },
      fr: { value: 'fr' },
      id: { value: 'id' },
      it: { value: 'it' },
      kr: { value: 'kr' },
      nl: { value: 'nl' },
      pt: { value: 'pt' },
      ru: { value: 'ru' },
      scn: { value: 'scn' },
      tcn: { value: 'tcn' },
      'tcn-yue': { value: 'tcn-yue' },
      tctn: { value: 'tctn' },
      th: { value: 'th' },
      ua: { value: 'ua' },
      vi: { value: 'vi' },
    },
  })
  'metadata.lang'?: string
}
