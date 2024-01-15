import { Controller, Get, UseGuards, Request, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { BearerAuthenticatedRequest } from '../auth/request/bearerAuthenticatedRequest';
import { Settings } from './entities/settings.entity';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getSettings(@Request() request: BearerAuthenticatedRequest): Promise<SettingsDto> {
    const id = request.user.id;
    const settings = await this.settingsService.getUserSettings(id);
    return settings.toDto();
  }

  @Put()
  @UseGuards(JwtGuard)
  async updateSettings(@Request() request: BearerAuthenticatedRequest, @Body() dto: SettingsDto): Promise<void> {
    const id = request.user.id;
    const settings = Settings.fromDto(dto);
    await this.settingsService.updateSettings(id, settings);
  }
}