# frozen_string_literal: true

module Api::V1
  class SpotsController < ApiController
    before_action -> { doorkeeper_authorize! :read }, only: %i[index show]
    before_action -> { doorkeeper_authorize! :write }, only: %i[create update destroy]

    def index
      render json: current_resource_owner.spots
    end

    def show
      render json: current_resource_owner.spots.find(params[:id])
    end

    def create
      @spot = current_resource_owner.spots.new(spot_params)

      if @spot.save
        render json: @spot
      else
        render json: @spot.errors, status: :unprocessable_entity
      end
    end

    def update
      @spot = current_resource_owner.spots.find(params[:id])
      if @spot.update(spot_params)
        render json: @spot
      else
        render json: @spot.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @spot.destroy
      render :ok
    end

    private

      def spot_params
        params.require(:spot).permit(:spotted_id, :image)
      end
  end
end
