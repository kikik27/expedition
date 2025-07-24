import { JwtAuthGuard } from "@app/common";
import { Global, Module } from "@nestjs/common";
import { AuthService } from "apps/auth/src/auth.service";

@Global()
@Module({
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class CommonAuthModule { }