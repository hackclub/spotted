# frozen_string_literal: true

class Member < ApplicationRecord
  belongs_to :user
  belongs_to :team
  has_many :spots, inverse_of: :spotted

  validates :user, :team, presence: true
end
