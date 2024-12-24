import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ResponseDTO } from 'src/dto/response.dto';
import { CreatePermissionResponseDTO } from './dto/create-permission-response.dto';
import { CreatePermissionRequestDTO } from './dto/create-permission-request.dto';
import { PermissionService } from './permission.service';
import { ResponseUtil } from 'src/util/response.util';
import { PermissionInfoResponseDTO } from './dto/permission-info-response.dto';
import { ListPermissionRequestDTO } from './dto/list-permission-request.dto';
import { ListPermissionResponseDTO } from './dto/list-permission-response.dto';

@Controller('permission')
export class PermissionController {
  constructor(
    private permissionService: PermissionService,
    private responseUtil: ResponseUtil,
  ) {}

  @Post()
  async create(
    @Body() request: CreatePermissionRequestDTO,
  ): Promise<ResponseDTO<CreatePermissionResponseDTO>> {
    const permissionResponseDTO = await this.permissionService.create(request);
    return this.responseUtil.successResponse(0, permissionResponseDTO);
  }

  @Get(':id')
  async getPermissionInfo(
    @Param('id') id: number,
  ): Promise<ResponseDTO<PermissionInfoResponseDTO>> {
    const responseDTO = await this.permissionService.getPermissionInfo(id);
    return this.responseUtil.successResponse(0, responseDTO);
  }

  @Get()
  async getPermissionList(
    @Query() requestDTO: ListPermissionRequestDTO,
  ): Promise<ResponseDTO<ListPermissionResponseDTO>> {
    const responseDTO =
      await this.permissionService.getAllPermissionsWithSearchCriteria(
        requestDTO,
      );
    return this.responseUtil.successResponse(0, responseDTO);
  }
}
