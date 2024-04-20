# frozen_string_literal: true

module Api::V1
  class CredentialsController < ApiController
    before_action :doorkeeper_authorize!

    def me
      render json: current_resource_owner
    end
    
    def update
      if current_resource_owner.update(params.require(:user).permit(:name, :picture))
        render json: current_resource_owner
      else
        render json: current_resource_owner.errors, status: :unprocessable_entity
      end
    end
  end
end
